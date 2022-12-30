import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppState} from './index'


export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector