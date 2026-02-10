
import { Box, Button, Card, Code, Flex, Heading, Label, Stack, Text, TextArea, useToast } from '@sanity/ui'
import { useState } from 'react'
import { Tool, useClient } from 'sanity'

export const BulkImportTool = () => {
    const [jsonInput, setJsonInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const toast = useToast()

    // Check if client is configured correctly
    const client = useClient({ apiVersion: '2024-02-03' })

    const handleImport = async () => {
        setIsLoading(true)
        setResult(null)

        try {
            let documents
            try {
                documents = JSON.parse(jsonInput)
            } catch (e) {
                throw new Error('Invalid JSON format. Please check your input.')
            }

            if (!Array.isArray(documents)) {
                throw new Error('Input must be an array of objects.')
            }

            const transaction = client.transaction()

            documents.forEach((doc: any) => {
                if (!doc._type) {
                    throw new Error('All documents must have a "_type" field.')
                }
                // If _id is present, use createOrReplace, otherwise create
                if (doc._id) {
                    transaction.createOrReplace(doc)
                } else {
                    transaction.create(doc)
                }
            })

            const res = await transaction.commit()

            setResult(`Success! Imported ${documents.length} documents.`)
            toast.push({
                status: 'success',
                title: 'Import Successful',
                description: `Imported ${documents.length} documents.`
            })
            setJsonInput('') // Clear input on success

        } catch (error: any) {
            console.error('Import failed:', error)
            setResult(`Error: ${error.message}`)
            toast.push({
                status: 'error',
                title: 'Import Failed',
                description: error.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box padding={4}>
            <Card padding={4} radius={2} shadow={1} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Stack space={4}>
                    <Heading as="h2" size={3}>Bulk Import Tool</Heading>
                    <Text size={2} muted>
                        Paste your JSON array here to import multiple documents at once.
                        Make sure each object has a valid <code>_type</code>.
                    </Text>

                    <Label>JSON Data</Label>
                    <TextArea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.currentTarget.value)}
                        rows={15}
                        placeholder='[{"_type": "distribution", "region": "Jakarta", ...}]'
                        radius={2}
                    />

                    <Flex justify="flex-end" gap={2}>
                        <Button
                            text={isLoading ? 'Importing...' : 'Import Data'}
                            tone="primary"
                            onClick={handleImport}
                            disabled={isLoading || !jsonInput.trim()}
                            loading={isLoading}
                        />
                    </Flex>

                    {result && (
                        <Card
                            padding={3}
                            radius={2}
                            tone={result.startsWith('Error') ? 'critical' : 'positive'}
                        >
                            <Code size={1}>{result}</Code>
                        </Card>
                    )}
                </Stack>
            </Card>
        </Box>
    )
}

export const bulkImportTool = (): Tool => {
    return {
        title: 'Bulk Import',
        name: 'bulk-import',
        component: BulkImportTool,
        icon: () => <span style={{ fontSize: '24px' }}>📥</span>
    }
}
