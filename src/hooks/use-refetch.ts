import { useQueryClient } from "@tanstack/react-query"

const UseRefetch = () => {

  const queryclient = useQueryClient()  
  return async () => (
    await queryclient.refetchQueries({
        type:'active'
    })
  )
}

export default UseRefetch