import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z} from 'zod/v4'
import { db } from '../../db/connections.ts'
import { schema } from '../../db/schema/index.ts'

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.post('/rooms', {
    schema: {
      body: z.object({
        name: z.string().min(1),
        description: z.string().optional()
      })
    }
  },
  async (request, reply) => {
    const { name, description } = request.body

    const response = await db.insert(schema.rooms).values({
      name,
      description
    }).returning()

    const insertedrRoom = response[0]

    if (!insertedrRoom) {
      throw new Error('Failed to create room')
    }

    return reply.status(201).send({ roomId: insertedrRoom.id })
  })
}