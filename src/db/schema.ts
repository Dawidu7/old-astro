import type { InferModel } from "drizzle-orm"
import {
  date,
  int,
  float,
  mysqlEnum,
  mysqlTable,
  serial,
  unique,
  varchar,
} from "drizzle-orm/mysql-core"

export const admin = mysqlTable("admin", {
  id: serial("id").primaryKey(),
  password: varchar("password", { length: 60 }).notNull(),
})

export const image = mysqlTable("image", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  imageUrl: varchar("imageUrl", { length: 255 }).notNull(),
  date: date("date").notNull(),
  optic: varchar("optic", { length: 255 }).notNull(),
  camera: varchar("camera", { length: 255 }).notNull(),
  mount: varchar("mount", { length: 255 }).notNull(),
  filters: varchar("filters", { length: 255 }).notNull(),
  sqml: varchar("sqml", { length: 255 }).notNull(),
  exposureDetails: varchar("exposureDetails", { length: 255 }).notNull(),
  acquisition: varchar("acquisition", { length: 255 }).notNull(),
  processing: varchar("processing", { length: 255 }).notNull(),
  info: varchar("info", { length: 255 }).notNull(),
  annotationUrl: varchar("annotationUrl", { length: 255 }).notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 255 }).notNull(),
})

export const camera = mysqlTable("camera", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  resolutionX: int("resolutionX").notNull(),
  resolutionY: int("resolutionY").notNull(),
  matrixX: float("matrixX").notNull(),
  matrixY: float("matrixY").notNull(),
  pixelSize: float("pixelSize").notNull(),
})

export const catalog = mysqlTable("catalog", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  value: varchar("value", { length: 255 }).notNull().unique(),
})

export const flattReduc = mysqlTable("flattReduc", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  times: float("times").notNull().unique(),
})

export const option = mysqlTable(
  "option",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    type: mysqlEnum("type", [
      "angle",
      "camera",
      "catalog",
      "constellation",
      "filter",
      "telescope",
    ]).notNull(),
  },
  t => ({
    unq: unique("option_name_type").on(t.name, t.type),
  }),
)

export const telescope = mysqlTable("telescope", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  focalLength: int("focalLength").notNull(),
  diameter: int("diameter").notNull(),
  focalRatio: float("focalRatio").notNull(),
})

export type Camera = InferModel<typeof camera>
export type Catalog = InferModel<typeof catalog>
export type FlattReduc = InferModel<typeof flattReduc>
export type Option = InferModel<typeof option>
export type Telescope = InferModel<typeof telescope>
