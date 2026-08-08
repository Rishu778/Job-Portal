import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`

export async function extractTextFromFile(file) {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
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
                    reject(err)
                }
            }
            reader.onerror = reject
            reader.readAsArrayBuffer(file)
        })
    }

    throw new Error('Unsupported file type. Please upload PDF or TXT.')
}
