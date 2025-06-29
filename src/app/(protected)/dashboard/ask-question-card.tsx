'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogHeader } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import UseProject from '@/hooks/use-project'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from "next/image"
import React from "react";
import { askQuestion } from './action';
import { readStreamableValue } from 'ai/rsc';
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from './code-reference';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

const AskQuestionCard = () => {

  const {project} = UseProject();
  const [question,setQuestion] = React.useState('')
  const [open,setopen] = React.useState(false);
  const [filesReference, setFilesReference] = React.useState<{ filename: string; sourceCode: string; summary: string }[]>([]);

  const [loading,setLoading] = React.useState(false);
  const [answer , setanswer] = React.useState('');
  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    setanswer('');
    setFilesReference([]);
    e.preventDefault();

    if(!project?.id) return
    setLoading(true);
    setopen(true);

    const {Output , filesReferences} = await askQuestion(question , project.id);
    setopen(true);
    setFilesReference(filesReferences);

    for await (const delta of readStreamableValue(Output))
    {
        if(delta)
        {
            setanswer(ans => ans + delta);
        }
    }

    setLoading(false);
  }

  return (
    <>
       <Dialog open={open} onOpenChange={setopen}> 
        <DialogContent className='sm:max-w-[80vw]'>
           <DialogHeader>
              <div className='flex items-center gap-2'>
               <DialogTitle>
                  <Image src='/Logo.png' alt='promptstack' width={60} height={40}></Image>
               </DialogTitle>
               <Button variant={'outline'} disabled={saveAnswer.isPending} onClick={() => {
                saveAnswer.mutate({
                  projectId: project!.id,
                  question,
                  answer,
                  filesReferences : filesReference
                }),{
                   onSuccess : () => {
                    toast.success('Answer saved!')
                   },
                   onError : () => {
                     toast.error("failed to save answer")
                   }
                }
               }}>
                Save Answer
               </Button>
              </div>
          </DialogHeader>
          <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll' />
          <div className='h-4'></div>
          <CodeReferences filesReferences={filesReference}/>
          <Button type='button' onClick={() => setopen(false)}>
            Close
          </Button>
        </DialogContent>
       </Dialog>
       <Card className='relative col-span-2'>
        <CardHeader>
            <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={onSubmit}>
                <Textarea placeholder='Which file should i edit to change the home page?' value={question} onChange={e=>setQuestion(e.target.value)}/>
                <div className='h-4'></div>
                <Button type='submit' disabled={loading}>
                    Ask PromptStack
                </Button>
            </form>
        </CardContent>
       </Card>
    </>
  )
}

export default AskQuestionCard