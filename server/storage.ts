import {
  users,
  customers,
  forms,
  formSubmissions,
  userFormMappings,
  type User,
  type UpsertUser,
  type Customer,
  type InsertCustomer,
  type Form,
  type InsertForm,
  type FormSubmission,
  type InsertFormSubmission,
  type UserFormMapping,
  type InsertUserFormMapping,
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;
  searchCustomers(query: string): Promise<Customer[]>;
  
  // Form operations
  getForms(): Promise<Form[]>;
  getForm(id: number): Promise<Form | undefined>;
  getFormsByUser(userId: string): Promise<Form[]>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: number, form: Partial<InsertForm>): Promise<Form>;
  deleteForm(id: number): Promise<void>;
  toggleFormStatus(id: number): Promise<Form>;
  
  // Form submission operations
  getFormSubmissions(): Promise<FormSubmission[]>;
  getFormSubmission(id: number): Promise<FormSubmission | undefined>;
  getFormSubmissionsByForm(formId: number): Promise<FormSubmission[]>;
  getFormSubmissionsByUser(userId: string): Promise<FormSubmission[]>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  
  // User-Form mapping operations
  getUserFormMappings(userId: string): Promise<UserFormMapping[]>;
  createUserFormMapping(mapping: InsertUserFormMapping): Promise<UserFormMapping>;
  deleteUserFormMapping(userId: string, formId: number): Promise<void>;
  
  // Statistics
  getStats(): Promise<{
    totalForms: number;
    activeUsers: number;
    totalSubmissions: number;
    revenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    return await db
      .select()
      .from(customers)
      .where(ilike(customers.name, `%${query}%`))
      .limit(10);
  }

  // Form operations
  async getForms(): Promise<Form[]> {
    return await db.select().from(forms).orderBy(desc(forms.createdAt));
  }

  async getForm(id: number): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.id, id));
    return form;
  }

  async getFormsByUser(userId: string): Promise<Form[]> {
    return await db
      .select({
        id: forms.id,
        title: forms.title,
        description: forms.description,
        fields: forms.fields,
        isActive: forms.isActive,
        createdBy: forms.createdBy,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
      })
      .from(forms)
      .innerJoin(userFormMappings, eq(forms.id, userFormMappings.formId))
      .where(eq(userFormMappings.userId, userId));
  }

  async createForm(form: InsertForm): Promise<Form> {
    const [newForm] = await db.insert(forms).values(form).returning();
    return newForm;
  }

  async updateForm(id: number, form: Partial<InsertForm>): Promise<Form> {
    const [updatedForm] = await db
      .update(forms)
      .set({ ...form, updatedAt: new Date() })
      .where(eq(forms.id, id))
      .returning();
    return updatedForm;
  }

  async deleteForm(id: number): Promise<void> {
    await db.delete(forms).where(eq(forms.id, id));
  }

  async toggleFormStatus(id: number): Promise<Form> {
    const form = await this.getForm(id);
    if (!form) throw new Error("Form not found");
    
    const [updatedForm] = await db
      .update(forms)
      .set({ isActive: !form.isActive, updatedAt: new Date() })
      .where(eq(forms.id, id))
      .returning();
    return updatedForm;
  }

  // Form submission operations
  async getFormSubmissions(): Promise<FormSubmission[]> {
    return await db.select().from(formSubmissions).orderBy(desc(formSubmissions.submittedAt));
  }

  async getFormSubmission(id: number): Promise<FormSubmission | undefined> {
    const [submission] = await db.select().from(formSubmissions).where(eq(formSubmissions.id, id));
    return submission;
  }

  async getFormSubmissionsByForm(formId: number): Promise<FormSubmission[]> {
    return await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId))
      .orderBy(desc(formSubmissions.submittedAt));
  }

  async getFormSubmissionsByUser(userId: string): Promise<FormSubmission[]> {
    return await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.userId, userId))
      .orderBy(desc(formSubmissions.submittedAt));
  }

  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const [newSubmission] = await db.insert(formSubmissions).values(submission).returning();
    return newSubmission;
  }

  // User-Form mapping operations
  async getUserFormMappings(userId: string): Promise<UserFormMapping[]> {
    return await db
      .select()
      .from(userFormMappings)
      .where(eq(userFormMappings.userId, userId));
  }

  async createUserFormMapping(mapping: InsertUserFormMapping): Promise<UserFormMapping> {
    const [newMapping] = await db.insert(userFormMappings).values(mapping).returning();
    return newMapping;
  }

  async deleteUserFormMapping(userId: string, formId: number): Promise<void> {
    await db
      .delete(userFormMappings)
      .where(and(eq(userFormMappings.userId, userId), eq(userFormMappings.formId, formId)));
  }

  // Statistics
  async getStats(): Promise<{
    totalForms: number;
    activeUsers: number;
    totalSubmissions: number;
    revenue: number;
  }> {
    const [formsCount] = await db.select({ count: forms.id }).from(forms);
    const [usersCount] = await db.select({ count: users.id }).from(users);
    const [submissionsCount] = await db.select({ count: formSubmissions.id }).from(formSubmissions);
    
    // Calculate revenue from collection plans
    const revenueResult = await db
      .select({ total: formSubmissions.collectionPlan })
      .from(formSubmissions)
      .where(eq(formSubmissions.collectionPlan, formSubmissions.collectionPlan)); // Non-null values
    
    const revenue = revenueResult.reduce((sum, row) => sum + (Number(row.total) || 0), 0);

    return {
      totalForms: formsCount?.count || 0,
      activeUsers: usersCount?.count || 0,
      totalSubmissions: submissionsCount?.count || 0,
      revenue,
    };
  }
}

export const storage = new DatabaseStorage();
