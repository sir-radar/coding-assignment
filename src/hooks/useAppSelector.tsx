import { TypedUseSelectorHook, useSelector } from 'react-redux'
import type { IRootState } from '../data/store'


export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
