'use client'
import UseProject from "@/hooks/use-project"
import { api } from "@/trpc/react"

import React from 'react'

const TeamMembers = () => {
  const {projectId} = UseProject();
  const {data : Members} = api.project.getTeamMembers.useQuery({projectId})
  return (
    <div className="flex items-center gap-2">
        {Members?.map(member => (
            <img key = {member.id} src={member.user.imageUrl || ' '} alt={member.user.firstName || ' '} width={30} height={30} className="rounded-full"></img>
        ))} 
    </div>
  )
}

export default TeamMembers