import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PodcastDetails } from "@/types";

interface PodcastInfoProps {
  podcastData: PodcastDetails| null;
  podcastFile: string | null
}

const PodcastInfo: React.FC<PodcastInfoProps> = ({
  podcastData,
  podcastFile
}) => {
  return ( 
    <div className="h-full w-full flex flex-col md:gap-12 md:px-24 md:py-12 gap-6 p-4">
      <div className="flex md:flex-row flex-col gap-8 items-center">
        <div className="relative shrink-0 w-60 rounded-md overflow-hidden aspect-square shadow-sm">
          <Image
            src={podcastFile || ''}
            fill
            alt="Card cover"
            className="object-cover"
            quality={90}
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-4xl font-bold">
            {podcastData?.title}
          </p>
          <p>
            {podcastData?.description}
          </p>
          <div className="flex gap-2 items-center flex-wrap">
            <Badge className="capitalize" variant={'secondary'}>
              {podcastData?.language}
            </Badge>
            <Badge className="capitalize" variant={'secondary'}>
              {podcastData?.category}
            </Badge>
            {podcastData?.tags && podcastData.tags.split(',').map((tag, index) => (
              <Badge className="capitalize" variant={'outline'} key={index}>
                {tag.trim()}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default PodcastInfo;