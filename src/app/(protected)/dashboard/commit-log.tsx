'use client'
import UseProject from '@/hooks/use-project'
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const CommitLog = () => {
 const {projectId , project}  = UseProject();
 const {data : commits} = api.project.getCommits.useQuery({projectId});

  return (
    <>
      <ul className='space-y-6 '>
        {commits?.map((commit,index) => {
            return <li key={commit.id} className='relative flex gap-x-4'> 
            <div className={cn(
                index === commits.length - 1 ? 'h-6' : 'bottom-8',
                'absolute left-0 top-0 flex w-6 justify-center'
            )}>
                <div className='w-px translate-x-1 bg-gray-200'></div>
            </div>
            <>
            <img src={commit.commitAuthorAvatar} alt='commit avatar' className='relative mt-4 size-8 flex-none rounded-full bg-gray-50'/>
            <div className='flex-auto rounded-mg bg-white p-3 ring-1 ring-inset ring-gray-200'>
                <div className='flex justify-between gap-x-4'>
                    <Link target='_blank' href={`${project?.githubUrl}/commit/${commit.commitHash}`} className='py-0.5 text-xs leading-5 text-gray-500'>
                        <span className='font-medium text-gray-800'>
                            {commit?.commitAuthorName}
                        </span>
                        <span className='pl-2 inline-flex items-center'>
                            committed
                            <ExternalLink className='ml-1 size-4'/>
                        </span>
                    </Link>
                </div>
                <span className='font-semibold'>
                    {commit?.commitMessage}
                </span>
                <pre className='mt-2 whitespace-pre-wrap text-gray-500'>
                    {commit.summary}
                 </pre>
            </div>       
            </>
            </li>
        })}
      </ul>
    </>
  )
}

export default CommitLog