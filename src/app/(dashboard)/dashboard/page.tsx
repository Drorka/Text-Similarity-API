import React, { FC } from 'react'

import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { notFound } from 'next/navigation'
import ApiDashboard from '@/src/components/ApiDashboard'
import RequestApiKey from '@/src/components/RequestApiKey'
import { db } from '@/src/lib/db'

export const metadata: Metadata = {
	title: 'SimilarityAPI | Dashboard',
	description: 'Free & open-source text similarity API',
}

const page = async () => {
	const user = await getServerSession(authOptions)
	if (!user) return notFound()

	const apiKey = await db.apiKey.findFirst({
		where: { userId: user.user.id, enabled: true },
	})

	return (
		<div className="max-w-7xl mx-auto mt-16">
			{apiKey ? (
				// @ts-expect-error Server Component
				<ApiDashboard />
			) : (
				<RequestApiKey />
			)}
		</div>
	)
}

export default page
