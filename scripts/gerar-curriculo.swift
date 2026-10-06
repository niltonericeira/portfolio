import Foundation
import CoreGraphics
import CoreText

// Execute: swift -module-cache-path /tmp/portfolio-swift-cache scripts/gerar-curriculo.swift
struct Block: Decodable { let style: String; let text: String }
struct Resume: Decodable { let pages: [[Block]] }
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let source = root.appendingPathComponent("scripts/curriculo.json")
let output = root.appendingPathComponent("assets/documentos/curriculo-nilton-ericeira.pdf")
let resume = try JSONDecoder().decode(Resume.self, from: Data(contentsOf: source))
var media = CGRect(x: 0, y: 0, width: 595.28, height: 841.89)
let info: [CFString: Any] = [kCGPDFContextTitle: "Currículo — Nilton Ericeira", kCGPDFContextAuthor: "Nilton Ericeira", kCGPDFContextSubject: "Broadcast, tecnologia, operações e soluções digitais"]
guard let context = CGContext(output as CFURL, mediaBox: &media, info as CFDictionary) else { fatalError("Não foi possível criar o PDF") }
let navy = CGColor(red: 0.028, green: 0.102, blue: 0.255, alpha: 1)
let gray = CGColor(red: 0.24, green: 0.29, blue: 0.36, alpha: 1)
let blue = CGColor(red: 0.03, green: 0.40, blue: 0.96, alpha: 1)
func draw(_ text: String, x: CGFloat = 44, top: CGFloat, width: CGFloat = 507.28, size: CGFloat, bold: Bool = false, color: CGColor = gray) -> CGFloat {
    let font = CTFontCreateWithName((bold ? "Helvetica-Bold" : "Helvetica") as CFString, size, nil)
    var lineSpacing: CGFloat = 3
    let paragraph = withUnsafePointer(to: &lineSpacing) { pointer in
        var settings = CTParagraphStyleSetting(spec: .lineSpacingAdjustment, valueSize: MemoryLayout<CGFloat>.size, value: pointer)
        return CTParagraphStyleCreate(&settings, 1)
    }
    let attrs: [NSAttributedString.Key: Any] = [NSAttributedString.Key(kCTFontAttributeName as String): font, NSAttributedString.Key(kCTForegroundColorAttributeName as String): color, NSAttributedString.Key(kCTParagraphStyleAttributeName as String): paragraph]
    let string = NSAttributedString(string: text, attributes: attrs)
    let setter = CTFramesetterCreateWithAttributedString(string)
    let bounds = CTFramesetterSuggestFrameSizeWithConstraints(setter, CFRange(location: 0, length: 0), nil, CGSize(width: width, height: 10000), nil)
    let height = ceil(bounds.height) + 3
    let path = CGPath(rect: CGRect(x: x, y: media.height - top - height, width: width, height: height), transform: nil)
    let frame = CTFramesetterCreateFrame(setter, CFRange(location: 0, length: 0), path, nil)
    context.textMatrix = .identity
    CTFrameDraw(frame, context)
    return height
}
for (pageIndex, blocks) in resume.pages.enumerated() {
    context.beginPDFPage(nil)
    context.setFillColor(blue)
    context.fill(CGRect(x: 44, y: media.height - 36, width: 48, height: 4))
    var top: CGFloat = 48
    for block in blocks {
        switch block.style {
        case "name": top += draw(block.text, top: top, size: 28, bold: true, color: navy) + 4
        case "subtitle": top += draw(block.text, top: top, size: 11, bold: true, color: blue) + 10
        case "contact":
            let height = draw(block.text, top: top, size: 9)
            if let start = block.text.range(of: "https://"), let url = URL(string: String(block.text[start.lowerBound...])) {
                context.setURL(url as CFURL, for: CGRect(x: 44, y: media.height - top - height, width: 507, height: height))
            }
            top += height + 5
        case "section":
            top += 8
            top += draw(block.text.uppercased(), top: top, size: 10, bold: true, color: blue) + 7
        case "heading": top += draw(block.text, top: top, size: 11, bold: true, color: navy) + 3
        default: top += draw(block.text, top: top, size: 11) + 4
        }
        guard top < 785 else { fatalError("Conteúdo excede a página \(pageIndex + 1): \(top)") }
    }
    context.setStrokeColor(CGColor(gray: 0.86, alpha: 1))
    context.setLineWidth(0.5)
    context.move(to: CGPoint(x: 44, y: 44)); context.addLine(to: CGPoint(x: 551, y: 44)); context.strokePath()
    _ = draw("Nilton Ericeira • Outubro de 2026", top: 807, size: 8)
    _ = draw("\(pageIndex + 1) / \(resume.pages.count)", x: 520, top: 807, width: 40, size: 8)
    context.endPDFPage()
    print("Página \(pageIndex + 1): conteúdo até \(Int(top)) pt")
}
context.closePDF()
print("PDF criado: \(output.path)")
