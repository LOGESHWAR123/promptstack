'use client'
import { Button } from '@/components/ui/button';
import UseProject from '@/hooks/use-project';
import UseRefetch from '@/hooks/use-refetch';
import { api } from '@/trpc/react'
import React from 'react'
import { toast } from 'sonner';

const ArchiveButton = () => {
  const archiveProject = api.project.archivePoject.useMutation();
  const {projectId} = UseProject()
  const refetch = UseRefetch()
  return (
    <Button disabled={archiveProject.isPending} size='sm' variant='destructive' onClick={()=> {
        const confirm = window.confirm("are you sure you want to delete this project?")
        if(confirm) archiveProject.mutate({projectId},{
            onSuccess:() => {
                toast.success("Project deleted successfully");
                refetch()
            },
            onError : () => {
                toast.error("failed to archive projectc")
            }
        })
    }}>
        Archive
    </Button>
  )
}

export default ArchiveButton