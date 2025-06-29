'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UseRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FromInput = {
    repoUrl : string
    projectName : string
    githubToken? : string
}


const CreatePage = () => {

  const {register , handleSubmit , reset} =  useForm<FromInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = UseRefetch();

  function onSubmit(data:FromInput){
    createProject.mutate({
        githubUrl : data.repoUrl,
        name : data.projectName,
        githubToken : data.githubToken
    },{
        onSuccess: () => {
            toast.success("Project created successfully");
            refetch()
            reset();
        },

        onError : () => {
            toast.error('Failed to create project');
        }
    })
    return true;
  }

  return (
    <div className='flex items-center gap-12 h-full justify-center'>
        <img src='/Programmer-Illustration.jpg' className='h-56 2-auto'/>
        <div>
            <div>
                <h1 className='font-semibold text-2xl'>
                    Link your Github Repository
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Enter the URL of you repository to link it to Promptstack
                </p>
            </div>
            <div className='h-4'></div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        {...register('projectName', {required:true})}
                        placeholder='Project Name'
                        required
                    />
                    <div className='h-2'></div>
                    <Input 
                        {...register('repoUrl', {required:true})}
                        placeholder='Github URL'
                        required
                    />
                    <div className='h-2'></div>
                    <Input 
                        {...register('githubToken')}
                        placeholder='Github Token (Optional)'
                    />
                    <div className='h-4'></div>
                    <Button type='submit' disabled={createProject.isPending}>
                        Create Project
                        {createProject.isPending && (
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CreatePage