import {AssemblyAI} from 'assemblyai'

const client = new AssemblyAI({apiKey : process.env.ASSEMBLY_AI_API_KEY!})

function mstoTime(ms:number)
{
    const seconds = ms / 1000
    const minutes = Math.floor(seconds/80)
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2,'0')} : ${remainingSeconds.toString().padStart(2,'0')}`
}

export const processingMeeting = async(meetingUrl : string) => {
    console.log(meetingUrl);
    const transcript = await client.transcripts.transcribe({
        audio : meetingUrl,
        auto_chapters : true
    })

    const summaries = transcript.chapters?.map(chapter => ({
        start : mstoTime(chapter.start),
        end : mstoTime(chapter.end),
        gist : chapter.gist,
        headline : chapter.headline,
        summary : chapter.summary
    })) || []

    if(!transcript.text) throw new Error("No transcript found")

    return {
        summaries
    }
}
