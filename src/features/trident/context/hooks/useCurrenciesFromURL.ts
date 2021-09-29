import { useRouter } from 'next/router'
import { useCurrency } from '../../../../hooks/Tokens'
import { Currency, NATIVE } from '@sushiswap/core-sdk'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from '../../../../hooks'
import { useRecoilValue } from 'recoil'
import { poolAtom } from '../atoms'

const useCurrenciesFromURL = (): [Currency[], (cur: Currency, index: number) => void] => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const [, pool] = useRecoilValue(poolAtom)

  const currencyA = useCurrency(router.query.tokens?.[0])
  const currencyB = useCurrency(router.query.tokens?.[1])

  const setURLCurrency = useCallback(
    async (cur: Currency, index: number) => {
      const tokens = [...router.query.tokens]
      tokens[index] = cur.isNative ? NATIVE[chainId].symbol : cur.wrapped.address

      await router.push({
        pathname: router.pathname,
        query: {
          tokens,
        },
      })
    },
    [chainId, router]
  )

  return useMemo(
    () => [[pool ? pool.token0 : currencyA, pool ? pool.token1 : currencyB], setURLCurrency],
    [currencyA, currencyB, pool, setURLCurrency]
  )
}

export default useCurrenciesFromURL