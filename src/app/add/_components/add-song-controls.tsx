import { Button } from "@/components/button";
import { useRef } from "react";
import { useSongFormContext } from "../contexts";

export default function AddSongControls() {
  const context = useSongFormContext();

  const backButton = useRef(null);
  const nextButton = useRef(null);

  const handleBackClicked = () => {
    context.index.set(context.index.current - 1);
  };

  const handleNextClicked = () => {
    if (context.index.current != context.index.max) {
      context.index.set(context.index.current + 1);
    } else {
      context.shouldSubmit.set(true);
    }
  };

  return (
    <div className="flex *:grow gap-2">
      {context.index.current > 0 && (
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
