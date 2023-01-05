
import { useEffect, useState } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { getStoredForm, storeForm } from "../../../common/storage";
import { useDispatch } from "react-redux";
import { formActions } from "../../../store/formSlice";
import BackdropLoader from "../../common/BackdropLoader";




export default function SurveyCreatorWidget() {
    const creatorOptions = {
        showLogicTab: false,
        isAutoSave: true,
        showJSONEditorTab: true,
    };

    const creator = new SurveyCreator(creatorOptions);
    creator.text = getStoredForm() || '';

    // const [openBackdrop, setOpenBackdrop] = useState(true);

    const dispatch = useDispatch()

    creator.saveSurveyFunc = (saveNo: number, callback: (a: number, b: boolean) => void) => {
      storeForm(creator.text);
      dispatch(formActions.setHash(creator.text));
      callback(saveNo, true);
    }

    useEffect(() => {
        
        (document.querySelector('.svc-creator__banner') as HTMLDivElement).style.visibility = 'hidden';
    })

    // creator.survey.onAfterRenderSurvey.add((s, o) => {
    //     setOpenBackdrop(false)
    // })
    return <>
        {/* <BackdropLoader open={openBackdrop} onClose={() => {}} /> */}
        <SurveyCreatorComponent creator={creator as SurveyCreator} />
    </>
}
