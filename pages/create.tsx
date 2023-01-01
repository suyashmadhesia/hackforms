import dynamic from "next/dynamic";


export default function CreateForm() {

    const SurveyCreatorWidget = dynamic(
        () => import('../components/form/create/SurveyCreatorWidget'),
        {ssr: false}
    )
    return <>
        <SurveyCreatorWidget />
    </>
}