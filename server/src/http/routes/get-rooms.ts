import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/connections.ts'
import { schema } from '../../db/schema/index.ts'
import { count, eq } from 'drizzle-orm'

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.get('/rooms', async () => {
    const response = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        description: schema.rooms.description,
        questionsCount: count(schema.questions.id),
        createdAt: schema.rooms.createdAt
      })
      .from(schema.rooms)
      .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
      .groupBy(schema.rooms.id)
      .orderBy(schema.rooms.createdAt)

      return response
  })
}