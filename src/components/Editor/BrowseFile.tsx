import { Component } from "solid-js";

export type BrowseFileProps = {
  onLoad: (bitmap: ImageBitmap) => void;
};

const BrowseFile: Component<BrowseFileProps> = (props: BrowseFileProps) => {
  let ref: HTMLInputElement | undefined;

  const handleChange = async () => {
    if (ref && ref.files) {
      const bitmap = await createImageBitmap(ref.files[0]);
      props.onLoad(bitmap);
    }
  };

  return (
    <input ref={ref} onChange={handleChange} type="file" multiple={false} />
  );
};

export default BrowseFile;
