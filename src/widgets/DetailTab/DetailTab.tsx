"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Range, Btn } from "@/shared/ui";
import { detailTabContainer, tabOverlap } from "./detailtab.css";
import useSplitRoute from "@/shared/hooks/useSplitRoute";

export default function DetailTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { route } = useSplitRoute();

  return (
    <>
      <div className={detailTabContainer}>
        <Btn
          size="big"
          color={route[1] === "info" ? "primary" : "reversePrimary"}
          onClick={() => {
            router.replace(`/${route[0]}/info`);
          }}
        >
          INFO
        </Btn>
        <Btn
          size="big"
          color={route[1] === "qna" ? "primary" : "reversePrimary"}
          onClick={() => {
            router.replace(`/${route[0]}/qna`);
          }}
          className={tabOverlap}
        >
          Q&A
        </Btn>
        <Btn
          size="big"
          color={route[1] === "review" ? "primary" : "reversePrimary"}
          onClick={() => {
            router.replace(`/${route[0]}/review`);
          }}
          className={tabOverlap}
        >
          REVIEW
        </Btn>
      </div>
    </>
  );
}
