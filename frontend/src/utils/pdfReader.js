export async function extractTextFromFile(file) {
    // If it's a text file, read directly
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    // If it's a PDF, use pdfjs from unpkg CDN
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    // Dynamically import pdfjs
                    const pdfjsLib = await import('https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.mjs')
                    
                    // Set worker
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 
                        'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.mjs'

                    const arrayBuffer = e.target.result
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
                    resolve(fullText)
                } catch (err) {
                    console.error('PDF extraction error:', err)
                    reject(new Error('Could not read PDF. Please try a TXT file instead.'))
                }
            }
            reader.onerror = reject
            reader.readAsArrayBuffer(file)
        })
    }

    throw new Error('Unsupported file type. Please upload PDF or TXT.')
}
