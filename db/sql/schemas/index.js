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
  nombre: varchar('nombre', 50),
  apellido: varchar('apellido', 50),
  email: varchar('email', 100),
  address_id: integer('address_id'),
  activebool: boolean('activebool'),
  create_date: timestamp('create_date', { default: 'now()' }),
  last_update: timestamp('last_update', { default: 'now()' }),
  activo: boolean('activo'),
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
export const filmSchema = pgTable('film', {
  film_id: serial('film_id').primaryKey(),
  titulo: varchar('titulo', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  lanzamiento: integer('lanzamiento'),
  language_id: smallint('language_id').notNull(),
  duracion_de_renta: smallint('duracion_de_renta').notNull().default(3),
  rental_rate: numeric('rental_rate').notNull().default(4.99),
  duracion: smallint('duracion'),
  costo_de_reemplazo: numeric('costo_de_reemplazo').notNull().default(19.99),
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
  fecha_de_renta: timestamp('fecha_de_renta').notNull(),
  inventory_id: integer('inventory_id').notNull(),
  customer_id: smallint('customer_id').notNull(),
  fecha_de_retorno: timestamp('fecha_de_retorno'),
  staff_id: smallint('staff_id').notNull(),
  last_update: timestamp('last_update', { default: 'now()' }),
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
  monto: numeric('monto').notNull(),
  fecha: timestamp('fecha').notNull(),
})
export const customerRelationships = relations(customerSchema, ({ many }) => ({
  payments: many(paymentSchema),
  rentals: many(rentalSchema),
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
