import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

interface HeaderProps {
  parentPath: string;
  parentPathLink?: string;
  childPath?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  parentPath,
  parentPathLink,
  childPath,
  children
}) => {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center justify-between w-full gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink 
                  className={childPath ? '' : 'hover:text-muted-foreground'}
                  href={childPath && parentPathLink}
                >
                  {parentPath}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {childPath && (
                <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{childPath}</BreadcrumbPage>
                </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;