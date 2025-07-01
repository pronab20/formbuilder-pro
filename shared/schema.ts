import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user").notNull(), // "admin" or "user"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customers table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forms table
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  fields: jsonb("fields").notNull(), // Array of form field definitions
  isActive: boolean("is_active").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form submissions table
export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  formId: integer("form_id").references(() => forms.id),
  userId: varchar("user_id").references(() => users.id),
  customerId: integer("customer_id").references(() => customers.id),
  data: jsonb("data").notNull(), // Submitted form data
  collectionPlan: decimal("collection_plan", { precision: 10, scale: 2 }),
  waterPlan: integer("water_plan"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// User-Form mappings (which forms are assigned to which users)
export const userFormMappings = pgTable("user_form_mappings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  formId: integer("form_id").references(() => forms.id),
  assignedBy: varchar("assigned_by").references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdForms: many(forms),
  formMappings: many(userFormMappings),
  submissions: many(formSubmissions),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  creator: one(users, { fields: [forms.createdBy], references: [users.id] }),
  submissions: many(formSubmissions),
  userMappings: many(userFormMappings),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  submissions: many(formSubmissions),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  form: one(forms, { fields: [formSubmissions.formId], references: [forms.id] }),
  user: one(users, { fields: [formSubmissions.userId], references: [users.id] }),
  customer: one(customers, { fields: [formSubmissions.customerId], references: [customers.id] }),
}));

export const userFormMappingsRelations = relations(userFormMappings, ({ one }) => ({
  user: one(users, { fields: [userFormMappings.userId], references: [users.id] }),
  form: one(forms, { fields: [userFormMappings.formId], references: [forms.id] }),
  assignedByUser: one(users, { fields: [userFormMappings.assignedBy], references: [users.id] }),
}));

// Insert schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFormSchema = createInsertSchema(forms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertUserFormMappingSchema = createInsertSchema(userFormMappings).omit({
  id: true,
  assignedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertForm = z.infer<typeof insertFormSchema>;
export type Form = typeof forms.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertUserFormMapping = z.infer<typeof insertUserFormMappingSchema>;
export type UserFormMapping = typeof userFormMappings.$inferSelect;
