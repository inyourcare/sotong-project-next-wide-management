
import { logger } from '@core/logger';
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';

const MenuTest = () => {
  const router = useRouter()
  const { page, search } = router.query
  const email = search?.at(0)

  const { data } = useQuery(
    // ["menuList", page, email],
    ["menuList", page, search],
    async () => {
      return await fetch(`/api/menu/list`, {
        method: 'POST',
        body: JSON.stringify({
          page: Number(page) - 1,
          limit: 5,
          conditions: {
            creator: {
              // email: 'admin@sotong.co.kr'
              email
            }
          }
        }),
        headers: { "Content-Type": "application/json" }
      }).then(async (result) => {
        const jsonResult = await result.json()
        logger.debug('useQuery result', jsonResult)
        return jsonResult
      })
    },
    {
      refetchOnMount: "always",
      // staleTime: 60 * 1000, // 1분
    }
  );

  return <p>Post: {page} , {search}</p>
}

export default MenuTest