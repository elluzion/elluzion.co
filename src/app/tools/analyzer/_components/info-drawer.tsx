import { Button } from "@/components/button";
import { InfoCard } from "@/components/info-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { mdiLink } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";

export default function InfoDrawer() {
  return (
    <Drawer>
      <DrawerTrigger className="font-mono text-muted-foreground underline underline-offset-2">
        Info
      </DrawerTrigger>
      <DrawerContent className="flex items-center" data-vaul-no-drag>
        <div className="max-w-[750px]">
          <DrawerHeader>
            <DrawerTitle>What are these values?</DrawerTitle>
          </DrawerHeader>
          <InfoCard className="bg-secondary mx-4 mb-4">
            This website uses{" "}
            <Link
              href="https://mtg.github.io/essentia.js/"
              target="_blank"
              className="underline underline-offset-4"
            >
              essentia.js
            </Link>{" "}
            and may produce wrong results from time to time.
          </InfoCard>
          <div className="prose-h4:flex prose-h4:items-center prose-h4:gap-2 mx-4 prose-h4:w-full max-h-[50vh] xl:max-h-full dark:prose-invert overflow-scroll prose">
            <h4>
              Key
              <Link
                href="https://essentia.upf.edu/reference/std_KeyExtractor.html"
                target="_blank"
              >
                <Icon path={mdiLink} size={0.75} />
              </Link>
            </h4>
            <p>Estimated key/scale for the given audio signal.</p>
            <h4>
              Tempo
              <Link
                href="https://essentia.upf.edu/reference/std_PercivalBpmEstimator.html"
                target="_blank"
              >
                <Icon path={mdiLink} size={0.75} />
              </Link>
            </h4>
            <p>The estimated tempo in beats per minute (BPM) .</p>
            <h4>
              Overall loudness
              <Link
                href="https://essentia.upf.edu/reference/std_LoudnessEBUR128.html"
                target="_blank"
              >
                <Icon path={mdiLink} size={0.75} />
              </Link>
            </h4>
            <p>
              synonym for "Integrated loudness": Loudness value averaged over an
              arbitrary long time interval with gating of 400 ms blocks with two
              thresholds:
              <ul className="list-disc">
                <li>
                  Absolute 'silence' gating threshold at -70 LUFS for the
                  computation of the absolute-gated loudness level.
                </li>
                <li>
                  Relative gating threshold, 10 LU below the absolute-gated
                  loudness level.
                </li>
              </ul>
            </p>
            <h4>
              Loudness range
              <Link
                href="https://essentia.upf.edu/reference/std_LoudnessEBUR128.html"
                target="_blank"
              >
                <Icon path={mdiLink} size={0.75} />
              </Link>
            </h4>
            <p>
              Computed from short-term loudness values, defined as the
              difference between the estimates of the 10th and 95th percentiles
              of the distribution of the loudness values with applied gating.
              <ul className="list-disc">
                <li>
                  Absolute 'silence' gating threshold at -70 LUFS for the
                  computation of the absolute-gated loudness level.
                </li>
                <li>
                  Relative gating threshold, -20 LU below the absolute-gated
                  loudness level.
                </li>
              </ul>
            </p>
          </div>
          <DrawerFooter>
            <DrawerClose>
              <Button>Okay</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
