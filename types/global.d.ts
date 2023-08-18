type SystemField = "id" | "createdAt" | "updatedAt"

type NoSystemFields<T> = Omit<T, SystemField>;