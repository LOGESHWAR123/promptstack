'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import UseProject from '@/hooks/use-project';
import { DialogTitle } from '@radix-ui/react-dialog';
import React from 'react'
import { toast } from 'sonner';

const InviteButton = () => {
  const [open,setopen] = React.useState(false);
  const {projectId} =  UseProject();
  return (
    <>
      <Dialog open={open} onOpenChange={setopen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Invite Team Members</DialogTitle>
            </DialogHeader>
            <p className='text-sm text-gray-500'>
                Ask them to copy and paste this link
            </p>
            <Input 
            className='mt-4'
            readOnly
            onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`)
                toast.success("copied to clipboard")
            }}
            value={`${window.location.origin}/join/${projectId}`}
            >      
            </Input>
        </DialogContent>
      </Dialog>
      <Button size='sm' onClick={()=>setopen(true)}>Invite Members</Button>
    </>
  )
}

export default InviteButton