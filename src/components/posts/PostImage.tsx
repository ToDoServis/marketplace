import { Component, createEffect, createSignal, JSX } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import placeholderImg from '../../assets/userImagePlaceholder.svg';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
  size: number;
  url: string | null;
  onUpload: (event: Event, filePath: string) => void;
}

const PostImage: Component<Props> = (props) => {
  const [imageUrl, setImageUrl] = createSignal<Array<string>>([]);
  // const [imageUrl, setImageUrl] = createSignal({ placeholderImg });
  const [uploading, setUploading] = createSignal(false);

  createEffect(() => {
    if (props.url) downloadImage(props.url);
  });

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("post.image")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setImageUrl([...imageUrl(), url]);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  };

  const uploadImage: JSX.EventHandler<HTMLInputElement, Event> = async (
    event
  ) => {
    try {
      setUploading(true);

      const target = event.currentTarget;
      if (!target?.files || target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("post.image")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      props.onUpload(event, filePath);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div class="flex-row text-center justify-center" aria-live="polite">
      {imageUrl().length > 0 ? (
        imageUrl().map((image) => (
          <img
            src={image}
            alt={imageUrl() ? "Image" : "No image"}
            class="user image border-2 border-border1 dark:border-border1-DM"
            style={{ height: `${props.size}px`, width: `${props.size}px` }}
          />
        ))
      ) : (
        <div class="flex justify-center">
        <svg
            width="120px" 
            height="120px" 
            viewBox="0 0 512 512" 
            version="1.1"
            class="fill-logo2 dark:fill-icon1 bg-background2 dark:bg-icon2-DM mb-4"
        >
            <title>image-filled</title>
            <g id="Page-1" stroke="none" stroke-width="1">
                <g id="icon" transform="translate(64.000000, 64.000000)">
                    <path d="M384,1.42108547e-14 L384,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L384,1.42108547e-14 Z M109.226667,142.933333 L42.666,249.881 L42.666,341.333 L341.333,341.333 L341.333,264.746 L277.333333,200.746667 L211.84,266.24 L109.226667,142.933333 Z M245.333333,85.3333333 C227.660221,85.3333333 213.333333,99.6602213 213.333333,117.333333 C213.333333,135.006445 227.660221,149.333333 245.333333,149.333333 C263.006445,149.333333 277.333333,135.006445 277.333333,117.333333 C277.333333,99.6602213 263.006445,85.3333333 245.333333,85.3333333 Z" id="Combined-Shape"></path>
                </g>
            </g>
        </svg>
        </div>
      )}
      <div class="mt-3">
        <label
          class="btn-primary"
          for="single"
        >
          {uploading() ? t("buttons.uploading") : t("buttons.uploadImage")}
        </label>
        <span style="display:none">
          <input
            type="file"
            id="single"
            accept="image/*"
            multiple
            onChange={uploadImage}
            disabled={uploading()}
          />
        </span>
      </div>
    </div>
  );
};

export default PostImage;
