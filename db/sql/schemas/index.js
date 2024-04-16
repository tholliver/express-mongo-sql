import { relations } from 'drizzle-orm'
import {
  date,
  integer,
  smallint,
  pgTable,
  serial,
  customType,
  pgEnum,
  text,
  varchar,
  timestamp,
  numeric,
  boolean,
} from 'drizzle-orm/pg-core'

export const storeSchema = pgTable('store', {
  store_id: serial('store_id'),
  manager_staff_id: integer('manager_staff_id'),
  address_id: integer('address_id'),
  last_update: date('last_update'),
})

export const customerSchema = pgTable('customer', {
  customer_id: serial('customer_id'),
  store_id: integer('store_id'),
  first_name: varchar('first_name', 50),
  last_name: varchar('last_name', 50),
  email: varchar('email', 100),
  address_id: integer('address_id'),
  activebool: boolean('activebool'),
  create_date: timestamp('create_date', { default: 'now()' }),
  last_update: timestamp('last_update', { default: 'now()' }),
  active: boolean('active'),
})

export const staffSchema = pgTable('staff', {
  staff_id: serial('staff_id'),
  nombre: varchar('nombre', 50),
  apellido: varchar('apellido', 50),
  address_id: integer('address_id'),
  email: varchar('email', 100),
  store_id: integer('store_id'),
  activo: boolean('activo'),
  usuario: varchar('usuario', 50),
  password: varchar('password', 255), // Update the length as needed
  last_update: timestamp('last_update', { default: 'now()' }),
})

const ratingEnum = pgEnum('rating', ['G', 'PG', 'PG-13', 'R', 'NC-17'])

// Define the tsvector custom type
const tsVector = customType({
  dataType(/*config*/) {
    return 'tsvector'
  },
  fromDriver(value) {
    return value
  },
  toDriver(value) {
    return value
  },
})

export const categorySchema = pgTable('category', {
  category_id: serial('category_id').primaryKey(),
  name: varchar('name', { length: 25 }),
  last_update: timestamp('last_update').notNull().default('now()'),
})

export const filmSchema = pgTable('film', {
  film_id: serial('film_id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  release_year: integer('release_year'),
  language_id: smallint('language_id').notNull(),
  rental_duration: smallint('rental_duration').notNull().default(3),
  rental_rate: numeric('rental_rate').notNull().default(4.99),
  length: smallint('length'),
  replacement_cost: numeric('replacement_cost').notNull().default(19.99),
  rating: ratingEnum('rating').default('G'),
  last_update: timestamp('last_update').notNull().default('now()'),
  special_features: text('special_features'), // NOTE: Special handling may be needed for array of text.
  fulltext: tsVector('fulltext').notNull(),
})

export const inventorySchema = pgTable('inventory', {
  inventory_id: serial('inventory_id').primaryKey().notNull(),
  film_id: smallint('film_id')
    .notNull()
    .references(() => filmSchema.film_id), // assuming "film_id" is the name of the column in the film table
  store_id: smallint('store_id').notNull(),
  last_update: timestamp('last_update').default('now()'),
})

export const rentalSchema = pgTable('rental', {
  rental_id: serial('rental_id').notNull(),
  rental_date: timestamp('rental_date').notNull(),
  inventory_id: integer('inventory_id').notNull(),
  customer_id: smallint('customer_id').notNull(),
  return_date: timestamp('return_date'),
  staff_id: smallint('staff_id').notNull(),
  last_update: timestamp('last_update', { default: 'now()' }),
})

export const addressSchema = pgTable('address', {
  address_id: serial('address_id').primaryKey(),
  address: varchar('address', { length: 50 }).notNull(),
  address2: varchar('address2', { length: 50 }),
  district: varchar('district', { length: 20 }).notNull(),
  city_id: smallint('city_id').notNull(),
  postal_code: varchar('postal_code', { length: 10 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  last_update: timestamp('last_update').default(`now()`),
})

export const paymentSchema = pgTable('payment', {
  payment_id: serial('payment_id').notNull(),
  customer_id: smallint('customer_id')
    .notNull()
    .references(() => customerSchema.customer_id),
  staff_id: smallint('staff_id')
    .notNull()
    .references(() => staffSchema.staff_id),
  rental_id: integer('rental_id')
    .notNull()
    .references(() => rentalSchema.rental_id),
  amount: numeric('amount').notNull(),
  payment_date: timestamp('payment_date').notNull(),
})
export const customerRelationships = relations(
  customerSchema,
  ({ many, one }) => ({
    payments: many(paymentSchema),
    rentals: many(rentalSchema),
    address: one(addressSchema, {
      fields: [customerSchema.address_id],
      references: [addressSchema.address_id],
    }),
  })
)

export const filmsRelationships = relations(filmSchema, ({ many }) => ({
  categoryToFilms: many(film_category),
}))

export const film_category = pgTable('film_category', {
  film_id: integer('film_id')
    .notNull()
    .references(() => filmSchema.film_id),
  category_id: integer('category_id')
    .notNull()
    .references(() => categorySchema.category_id),
  last_update: timestamp('last_update').default(`now()`),
})

export const film_categoryRelationships = relations(
  film_category,
  ({ one }) => ({
    film: one(filmSchema, {
      fields: [film_category.film_id],
      references: [filmSchema.film_id],
    }),
    category: one(categorySchema, {
      fields: [film_category.category_id],
      references: [categorySchema.category_id],
    }),
  })
)

export const categoriesRelationships = relations(
  categorySchema,
  ({ many }) => ({
    categoryToFilms: many(film_category),
  })
)

export const addressRelationships = relations(addressSchema, ({ one }) => ({
  customer: one(customerSchema),
}))

export const paymentRelationships = relations(paymentSchema, ({ one }) => ({
  customer: one(customerSchema, {
    fields: [paymentSchema.customer_id],
    references: [customerSchema.customer_id],
  }),
}))

export const rentalSchemaRelationships = relations(rentalSchema, ({ one }) => ({
  customer: one(customerSchema, {
    fields: [rentalSchema.customer_id],
    references: [customerSchema.customer_id],
  }),
}))

export const inventoryRelationship = relations(rentalSchema, ({ one }) => ({
  rental: one(rentalSchema, {
    fields: [rentalSchema.inventory_id],
    references: [inventorySchema.inventory_id],
  }),
}))
