import { useEffect } from "react";

type Props = {
  trigger: any;
};

export default function ScrollToTopOnError({ trigger }: Props) {
  useEffect(() => {
    if (
      trigger &&
      (typeof trigger === "string" ? trigger : Object.keys(trigger).length > 0)
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [trigger]);
  return null;
}
