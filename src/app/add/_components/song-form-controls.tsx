import { Button } from "@/components/button";
import { useRef } from "react";
import { useSongFormContext } from "../context";

export default function SongFormControls() {
  const context = useSongFormContext();

  const index = context.index;

  const backButton = useRef(null);
  const nextButton = useRef(null);

  const handleBackClicked = () => {
    index.set(index.current - 1);
  };

  const handleNextClicked = () => {
    if (index.current != index.max) {
      index.set(index.current + 1);
    } else {
      context.shouldSubmit.set(true);
    }
  };

  return (
    <div className="flex *:grow gap-2">
      {index.current > 0 && (
        <Button ref={backButton} variant={"secondary"} onClick={handleBackClicked}>
          Back
        </Button>
      )}
      <Button ref={nextButton} onClick={handleNextClicked}>
        Next
      </Button>
    </div>
  );
}
