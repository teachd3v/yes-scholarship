import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
    console.error('Error: Please overwrite .env.local with your Sanity credentials.')
    console.error('Make sure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN are set.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-02-03',
    useCdn: false,
})

const importData = async () => {
    try {
        const dataPath = path.join(__dirname, 'sample-distribution.json')
        const rawData = fs.readFileSync(dataPath, 'utf8')
        const documents = JSON.parse(rawData)

        console.log(`Starting import of ${documents.length} documents...`)

        const transaction = client.transaction()

        documents.forEach((doc) => {
            transaction.createOrReplace(doc)
        })

        await transaction.commit()
        console.log('Import successful!')
    } catch (error) {
        console.error('Import failed:', error.message)
    }
}

importData()
