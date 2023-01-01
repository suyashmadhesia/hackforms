
import { useEffect } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";


import * as crypto from 'crypto-js';

export default function SurveyCreatorWidget() {
    const creatorOptions = {
        showLogicTab: true,
        isAutoSave: true
    };

    let CryptoJS = crypto;

    var JsonFormatter = {
        stringify: function(cipherParams: any) {
          // create json object with ciphertext
          var jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64), iv: undefined, s: undefined };
      
          // optionally add iv or salt
          if (cipherParams.iv) {
            jsonObj.iv = cipherParams.iv.toString();
          }

          if (cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString();
          }
     
          // stringify json object
          return JSON.stringify(jsonObj);
        },
        parse: function(jsonStr: string) {
          // parse json string
          var jsonObj = JSON.parse(jsonStr);
     
          // extract ciphertext from json object, and create cipher params object
          var cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
          });
     
          // optionally extract iv or salt
     
          if (jsonObj.iv) {
            cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
          }
     
          if (jsonObj.s) {
            cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
          }
     
          return cipherParams;
        }
      };

    const creator = new SurveyCreator(creatorOptions);

    (window as any).cryptojs = crypto;
    (window as any).jsonFormatter = crypto;

    useEffect(() => {
        (document.querySelector('.svc-creator__banner') as HTMLDivElement).style.visibility = 'hidden'
    })
    return <SurveyCreatorComponent creator={creator as SurveyCreator} />;
}
/**
 * 
 * b6IojDYb7M4+MLpMQb59i6AeNYBWb3rMdqf5mZRHTEY=
 * XW54cq+HXYVZJH4bFWp0Bw==
 */