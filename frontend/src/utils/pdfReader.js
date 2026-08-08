export async function extractTextFromFile(file) {
    // TXT file — read directly
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    // PDF file — extract text page by page
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer()
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.mjs',
            import.meta.url
        ).toString()

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ')
            fullText += pageText + '\n'
        }

        return fullText
    }

    throw new Error('Please upload a PDF or TXT file.')
}
