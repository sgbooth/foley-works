import { ActionIcon } from "@mantine/core";
import {
  IconMathSymbols,
  IconFilePencil,
  IconView360Arrow,
  IconDotsVertical,
  IconSearch,
  IconInfoCircle,
  IconAlertCircleFilled,
  IconFolders,
  IconWorld,
  IconFileTypeDocx,
  IconLogout,
} from "@tabler/icons-react";
import {
  FaBookOpen,
  FaClipboard,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaCopy,
  FaEdit,
  FaFile,
  FaFileCode,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
  FaFilter,
  FaFolder,
  FaFolderPlus,
} from "react-icons/fa";
import { FaFileCirclePlus, FaFileZipper } from "react-icons/fa6";

import { ImCheckmark, ImCross, ImLock, ImUnlocked } from "react-icons/im";
import {
  MdAddCircle,
  MdAddTask,
  MdBlock,
  MdCancel,
  MdHome,
  MdOutlineEmail,
  MdOutlineNoteAdd,
  MdFormatLineSpacing,
  MdImage,
  MdLabel,
  MdLabelOff,
  MdLinkOff,
  MdContactSupport,
} from "react-icons/md";
import {
  VscChevronDown,
  VscChevronUp,
  VscThreeBars,
  VscWarning,
  VscSearchFuzzy,
  VscChevronRight,
  VscChevronLeft,
  VscQuestion,
  VscGear,
  VscGitCompare,
  VscTable,
  VscGithub,
  VscListOrdered,
  VscCopy,
  VscPreserveCase,
  VscPreview,
  VscRemote,
  VscRemove,
  VscClose,
  VscTrash,
  VscGitMerge,
} from "react-icons/vsc";

export const Icon = {
  Add: MdAddCircle,
  AddTask: MdAddTask,
  AddFile: FaFileCirclePlus,
  AddFolder: FaFolderPlus,
  AddNote: MdOutlineNoteAdd,
  Settings: VscGear,
  Support: MdContactSupport,
  Symbol: IconMathSymbols,
  Claim: VscListOrdered,
  Close: VscRemove,
  Tool: VscGithub,
  Spec: IconFilePencil,
  Search: IconSearch,
  SearchSemantic: VscSearchFuzzy,
  Info: IconInfoCircle,
  Error: IconAlertCircleFilled,
  Warning: VscWarning,
  Refresh: IconView360Arrow,
  Menu: VscThreeBars,
  MenuDots: IconDotsVertical,
  Book: FaBookOpen,
  Clipboard: FaClipboard,
  Copy: VscCopy,
  Edit: FaEdit,
  Download: FaCloudDownloadAlt,
  Check: ImCheckmark,
  Cross: ImCross,
  Remove: VscTrash,
  Block: MdBlock,
  Lock: ImLock,
  Unlock: ImUnlocked,
  CloudUpload: FaCloudUploadAlt,
  Home: MdHome,
  FilePdf: FaFilePdf,
  FileDocx: FaFileWord,
  FileXlsx: FaFileExcel,
  FileXml: FaFileCode,
  File: FaFile,
  Folder: FaFolder,
  Folders: IconFolders,
  Table: VscTable,
  Filter: FaFilter,
  Globe: IconWorld,
  Notes: FaBookOpen,
  Email: MdOutlineEmail,
  Image: MdImage,
  Label: MdLabel,
  LabelOff: MdLabelOff,
  LinkOff: MdLinkOff,
  LineSpacing: MdFormatLineSpacing,
  Logout: IconLogout,
  ChevronUp: VscChevronUp,
  ChevronDown: VscChevronDown,
  ChevronRight: VscChevronRight,
  ChevronLeft: VscChevronLeft,
  Help: VscQuestion,
  Compare: VscGitCompare,
  Preview: VscPreview,
  Merge: VscGitMerge,
};

type Props = {
  onClick: () => void;
  color?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
};

export let RemoveActionIcon: React.FC<Props> = ({
  onClick,
  color = "red",
  variant = "transparent",
  size = "sm",
  disabled = false,
}) => {
  return (
    <ActionIcon
      color={color}
      onClick={onClick}
      children={<Icon.Remove />}
      variant={variant}
      size={size}
      disabled={disabled}
    />
  );
};

export let RemoveActionIcon_Alt: React.FC<Props> = ({
  onClick,
  color = "red",
  variant = "transparent",
  size = "sm",
  disabled = false,
}) => {
  return (
    <ActionIcon
      color={color}
      onClick={onClick}
      children={<VscClose />}
      variant={variant}
      size={size}
      disabled={disabled}
    />
  );
};

export let SearchActionIcon: React.FC<Props> = ({
  onClick,
  color = "indigo",
  variant = "transparent",
  size = "sm",
  disabled = false,
}) => {
  return (
    <ActionIcon
      color={color}
      onClick={onClick}
      children={<Icon.Search />}
      variant={variant}
      size={size}
    />
  );
};
