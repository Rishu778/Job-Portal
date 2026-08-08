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

    // PDF file
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        return new Promise(async (resolve, reject) => {
            try {
                const arrayBuffer = await file.arrayBuffer()

                // Load pdfjs from CDN that supports CORS
                const script = document.createElement('script')
                script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js'
                
                await new Promise((res, rej) => {
                    script.onload = res
                    script.onerror = rej
                    document.head.appendChild(script)
                })

                const pdfjsLib = window['pdfjs-dist/build/pdf']
                pdfjsLib.GlobalWorkerOptions.workerSrc = 
                    'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

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
                reject(new Error('Could not read PDF. Please upload a TXT file instead.'))
            }
        })
    }

    throw new Error('Please upload a PDF or TXT file.')
}
