
import dynamic from "next/dynamic";
import { useGetLoginStatus } from "../common/custom_hooks";


export default function Dashboard() {

    const isUserLoggedIn = useGetLoginStatus();


    const DashboardView = dynamic(
        () => import('../components/DashboardView'),
        {ssr: false}
    )

    return <>
        <DashboardView />
    </>

}
