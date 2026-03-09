export enum UserRole {
    USER = "user",
    SUB_ADMIN = "subAdmin",
    SUPER_ADMIN = "superAdmin"
}

export enum SubAdminStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export enum BookingStatus {
    NEW = "new",
    SENT = "sent",
    RECEIVED = "received",
    PREPARATION = "preparation",
    REVIEW = "review",
    APPROVED = "approved",
    FILED = "filed",
    SCHEDULED = "scheduled",
    ACTIVE = "active",
    COMPLETED = "completed",
    IN_START = "in_start",
}

export enum FileStatus {
    PENDING = "pending",
    SENT = "sent",
    RECEIVED = "received",
    REJECTED = "rejected",
}

export enum ChatStatus {
    PENDING = "pending",
    ACTIVE = "active",
    RESOLVED = "resolved",
}