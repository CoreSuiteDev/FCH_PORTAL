import { z } from "zod";
import { PaginationMetaSchema } from "./pagination"

// --- ENUMS ---

export const EventVisibilityEnum = z.enum([
  "PUBLIC",
  "FREE_WEBINAR",
  "MEMBER_ONLY",
  "PASTORAL_ONLY",
  "BOARD_ONLY",
]);
export type EventVisibility = z.infer<typeof EventVisibilityEnum>;

export const EventStatusEnum = z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]);
export type EventStatus = z.infer<typeof EventStatusEnum>;

export const EventTypeEnum = z.enum(["EVENT", "WEBINAR"]);
export type EventType = z.infer<typeof EventTypeEnum>;

export const RegistrationStatusEnum = z.enum(["PENDING", "CONFIRMED", "CANCELLED"]);
export type RegistrationStatus = z.infer<typeof RegistrationStatusEnum>;

// --- WEBINAR ---

export const ZCIWebinarSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  speakers: z.array(z.string()),
  createdAt: z.coerce.date(),
});
export type ZTWebinar = z.infer<typeof ZCIWebinarSchema>;

// --- EVENT CATEGORY ---

export const ZCIEventCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ZTEventCategory = z.infer<typeof ZCIEventCategorySchema>;

export const ZCICreateEventCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});
export type ZTCCreateEventCategory = z.infer<typeof ZCICreateEventCategorySchema>;

export const ZCIUpdateEventCategorySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
});
export type ZTCUpdateEventCategory = z.infer<typeof ZCIUpdateEventCategorySchema>;

// --- EVENT MATERIAL ---

export const ZCIEventMaterialSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string(),
  fileUrl: z.string().url("Must be a valid URL"),
  fileType: z.string(),
  eventId: z.string(),
});
export type ZTEventMaterial = z.infer<typeof ZCIEventMaterialSchema>;

export const ZCICreateMaterialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileUrl: z.string().url("Must be a valid URL"),
  fileType: z.string().min(1, "File type is required"),
});
export type ZTCCreateMaterial = z.infer<typeof ZCICreateMaterialSchema>;

// --- EVENT REGISTRATION ---

export const ZCIEventRegistrationSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  eventId: z.string(),
  userId: z.string(),
  status: RegistrationStatusEnum,
  checkedIn: z.boolean(),
});
export type ZTEventRegistration = z.infer<typeof ZCIEventRegistrationSchema>;

// --- EVENT ---

export const ZCIEventSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  location: z.string(),
  coverImage: z.string().nullable().optional(),
  maxCapacity: z.number().nullable().optional(),
  currentCount: z.number().optional(),
  meetingLink: z.string().nullable().optional(),
  visibility: EventVisibilityEnum,
  isActive: z.boolean(),
  status: EventStatusEnum,
  eventType: EventTypeEnum,
  webinar: ZCIWebinarSchema.nullable().optional(),
  categories: z.array(ZCIEventCategorySchema),
  materials: z.array(ZCIEventMaterialSchema),
  registrations: z.array(ZCIEventRegistrationSchema).optional(),
});
export type ZTEvent = z.infer<typeof ZCIEventSchema>;


// --- CREATE / UPDATE PAYLOADS ---

export const ZCICreateEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().min(1, "Location is required"),
  coverImage: z.string().optional(),
  maxCapacity: z.number().int().nonnegative().optional(),
  meetingLink: z.string().optional(),
  visibility: EventVisibilityEnum.default("PUBLIC"),
  eventType: EventTypeEnum.default("EVENT"),
  speakers: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  materials: z.array(ZCICreateMaterialSchema).optional(),
});
export type ZTCCreateEvent = z.infer<typeof ZCICreateEventSchema>;
export type ZTCCreateEventInput = z.input<typeof ZCICreateEventSchema>;

export const ZCIUpdateEventSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  location: z.string().min(1, "Location cannot be empty").optional(),
  coverImage: z.string().optional(),
  maxCapacity: z.number().int().nonnegative().optional(),
  meetingLink: z.string().optional(),
  visibility: EventVisibilityEnum.optional(),
  eventType: EventTypeEnum.optional(),
  speakers: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  materials: z.array(ZCICreateMaterialSchema).optional(),
  isActive: z.boolean().optional(),
  status: EventStatusEnum.optional(),
});
export type ZTUpdateEvent = z.infer<typeof ZCIUpdateEventSchema>;
export type ZTUpdateEventInput = z.input<typeof ZCIUpdateEventSchema>;



// --- ANALYTICS ---

export const ZCIEventAnalyticsSchema = z.object({
  eventId: z.string(),
  title: z.string(),
  maxCapacity: z.number().nullable(),
  totalRegistrations: z.number(),
  totalCheckedIn: z.number(),
  attendanceRate: z.number(),
  capacityUtilization: z.number(),
  statusBreakdown: z.object({
    CONFIRMED: z.number(),
    PENDING: z.number(),
    CANCELLED: z.number(),
  }),
  totalMaterials: z.number(),
});
export type ZTEventAnalytics = z.infer<typeof ZCIEventAnalyticsSchema>;

// --- PAGINATED ---

export const ZCIPaginatedEventsSchema = z.object({
  data: z.array(ZCIEventSchema),
  meta: PaginationMetaSchema,
});
export type ZTPaginatedEvents = z.infer<typeof ZCIPaginatedEventsSchema>;
