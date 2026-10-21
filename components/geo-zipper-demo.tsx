"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

type GeoZipperApi = { finish: () => void; reset: () => void; destroy: () => void };

declare global {
  interface Window { GeoZipper?: { mount: (root: HTMLElement) => GeoZipperApi } }
}

const src = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/js/geo-zipper.js`;

export function GeoZipperDemo() {
  const root = useRef<HTMLDivElement>(null);
  const api = useRef<GeoZipperApi | null>(null);
  const mount = () => { if (root.current && !api.current) api.current = window.GeoZipper?.mount(root.current) ?? null; };
  useEffect(() => () => { api.current?.destroy(); api.current = null; }, []);
  return <div className="geo-zipper-wrap"><div id="geo-zipper" ref={root} /><Script src={src} onReady={mount} /></div>;
}
