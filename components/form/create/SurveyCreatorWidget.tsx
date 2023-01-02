
import { useEffect } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { useAppSelector } from "../../../store/hooks";
import { useDispatch } from "react-redux";
import { formActions } from "../../../store/formSlice";



export default function SurveyCreatorWidget() {
    const creatorOptions = {
        showLogicTab: false,
        isAutoSave: true,
        showJSONEditorTab: true,
    };

    const creator = new SurveyCreator(creatorOptions);
    creator.text = window.localStorage.getItem('survey-json') || ''

    creator.saveSurveyFunc = (saveNo: number, callback: (a: number, b: boolean) => void) => {
      window.localStorage.setItem('survey-json', creator.text) 
      callback(saveNo, true);
    }

    useEffect(() => {
        
        (document.querySelector('.svc-creator__banner') as HTMLDivElement).style.visibility = 'hidden';
    })
    return <SurveyCreatorComponent creator={creator as SurveyCreator} />;
}
