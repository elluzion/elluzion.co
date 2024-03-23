import { useRef } from "react";

import { Button } from "@/components/button";

export default function AddSongControls(props: {
  index: number;
  setIndex: (newIndex: number) => void;
  setShouldSubmitForm: (shouldSubmit: boolean) => void;
  maxIndex: number;
}) {
  const backButton = useRef(null);
  const nextButton = useRef(null);

  const handleBackClicked = () => {
    props.setIndex(props.index - 1);
  };

  const handleNextClicked = () => {
    if (props.index != props.maxIndex) {
      props.setIndex(props.index + 1);
    } else {
      // try submitting the form
      props.setShouldSubmitForm(true);
    }
  };

  return (
    <div className="flex *:grow gap-2">
      {props.index > 0 && (
        <Button
          ref={backButton}
          variant={"secondary"}
          onClick={handleBackClicked}
        >
          Back
        </Button>
      )}
      <Button ref={nextButton} onClick={handleNextClicked}>
        Next
      </Button>
    </div>
  );
}
