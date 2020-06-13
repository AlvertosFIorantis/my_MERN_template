import React, { useRef, useState, useEffect } from "react";

import "./imageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  // to use effect to xirsimoipo gia to image preview kai epidi exo os dependnacy to [file] afto simeni oti afto to hook tha ektelite mono kathe fora pou alazei to file state diladi otan kano upload kapio image (den litourgi san component did moun mias kai exo to file dependcy)
  useEffect(() => {
    // tsakaro an exo file giati to file borei na alakse epeidi ekana delete to file opote apo ti stigmi pou alakse to state hta treksei to useeffect ala ego thelo na trexei otan alazei kai exo kapio file
    if (!file) {
      return;
    }
    // to FileReader eiani built in JavaScript function kai ousitakta  afto to function kanei parse ta files kai epidi exi periregei api to kratao opos einia gia to project mou kai to mono pou boro na kano einai na alakso to object pou tou pernao sto readAaDatUrl pou edo pernao to file state
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    // epidi to input boxi eani type feild exo to event.target.files kai apla thelo na do oti exo anevazi monon ena file ! gia afto kai exo .length===1
    if (event.target.files && event.target.files.length === 1) {
      // kano extract to file pou exei kanei upload o user
      pickedFile = event.target.files[0];
      // console.log(pickedFile);
      // kano set to state mou me afto to file
      setFile(pickedFile);
      // vazo setValid to true giati exo troa ena file uplaoded
      setIsValid(true);
      // epiti to setValid den ginete katefthian updated exo kai ena dummy varible gia na kano store to idio value me to setValid state to idio kano kai sto else statement
      fileIsValid = true;
      //me to custom function pou eftiaksa ego sto parent component ektos apo to na kano set to state mesa se afto to componete the lo na to kano set kai sto parent compoente pou exo to email kai to passwrod gia na exo kai to image ekei
      props.uploadImageHandler(pickedFile);
    } else {
      // an gia kapio logo den exo file thelo to setValid se false
      setIsValid(false);
      fileIsValid = false;
    }
    // to onInput popos to perno apo to parent component kai pernao ta 3 argumetns mesa se afto to function
  };

  // to helper function pou exo ftiaksi otan pataiete ektele to filePickerRef helper function pou to vazo ego na eina iuseRef oste na xrisimpopio to ref pou to exo valei sto input gia afto sto input exo ref={filePickerRef} kai to exo kanei initialize me to filePiakceRef= useRef() Met to use ref exo access se ena ali object meso tou alou
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        // to exo display none gia na min fenete to input box pou deinia eiani oreo kai tha exo to functionaltiy apo to input field me to botton opote o User tha pataei to button pou thelo gia na anevasi ti fotografia pou thelo
        style={{ display: "none" }}
        type="file"
        // to input einai  type file gia na boro na kano upload files kai me to accept kano specify na eiani mono images logo tou extension pou exo
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
        // to onChange ektelite otan o xristis epileksi kapio item
      />
      <div className={`image-upload ${props.center && "center"}`}>
        {/* me to image preview tha dixno sto user to image pou anevase !!! */}
        <div className="image-upload__preview">
          {/* an exo kanie parse to file toote exo previeURl opote boro na kano render to image kai gia afto to pernao san value sto src opote afto tha dixnei san ikonna */}
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {/* an den exo image tote apla thelo na dixno ena p tag pou na leei sto user na anevasi to image den thelo na dixno ena adio xoro */}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        {/* otan patao to button thelo na ektelite i dinatotita pou dini to input field pou einxia hid gia na anevasi o user to photo. To function pou to kanie afto einai to pickImageHandler */}
        <button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </button>
      </div>
      {/* an den exo valie valid image thelo na dixno to error message */}
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
