'use client'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import React from 'react';
import { Card } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '@/lib/firebase';
import { Presentation, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import UseProject from '@/hooks/use-project';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const MeetingCard = () => {
  const [progress, setProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const uploadMeetings = api.project.uploadMeeting.useMutation()
  const {project} = UseProject();

const processMeeting = useMutation({
  mutationFn : async (payload: { meetingUrl: string; meetingId: string; projectId: string }) => {
    const { meetingUrl, meetingId, projectId } = payload;
    const response = await axios.post('/api/process-meeting', {
      meetingUrl,
      meetingId,
      projectId
    });
    return response.data;
  }
});

  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"]
    },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async (acceptedFiles) => {
      if(!project) return null;
      setIsUploading(true);
      const file = acceptedFiles[0];
      if(!file) return
      const downloadUrl = await uploadFile(file as File, setProgress);
      uploadMeetings.mutate({
        projectId : project!.id,
        meetingUrl : downloadUrl,
        name:file?.name
      },{
        onSuccess :(meeting) => {
            toast.success("Meeting uploades successfully");
            router.push('/meetings')
            processMeeting.mutateAsync({meetingUrl : downloadUrl , meetingId : meeting.id , projectId : project.id})
        },
        onError : () =>{
            toast.error("Failed to upload meeting")
        }
      })
      setIsUploading(false);
    }
  });

  return (
    <Card
      className="col-span-2 flex flex-col items-center justify-center"
      {...getRootProps()}
    >
      {!isUploading && (
        <>
          <Presentation className="h-10 w-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Create a new meeting
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Analyse your meeting with PromptStack
            <br />
            Powered by AI
          </p>
          <div className="mt-6">
            <Button disabled={isUploading} asChild>
              <span>
                <Upload
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Upload Meeting
                <input className="hidden" {...getInputProps()} />
              </span>
            </Button>
          </div>
        </>
      )}
      {isUploading && (
        <div className="flex flex-col items-center justify-center">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            className="size-20"
            styles={
                buildStyles({
                    pathColor:'#2563eb',
                    textColor : '#2563eb'
                })
            }
          />
          <p className="mt-2 text-sm text-gray-500 text-center">
            Uploading your meeting...
          </p>
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
