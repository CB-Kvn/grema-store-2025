import { RootState } from '@/interfaces';
import { TypedUseSelectorHook, useSelector } from 'react-redux';


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;