
import dynamic from "next/dynamic";


export default function Dashboard() {

    const DashboardView = dynamic(
        () => import('../components/DashboardView'),
        {ssr: false}
    )

    return <>
        <DashboardView />
    </>

}
